using BookAllotment.API.Models;
using BookAllotment.API.Repositories;
using BookAllotment.API.Repositories.Interfaces;
using BookAllotment.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IO.Compression;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);


// ═══════════════════════════════════════════════════════════
// DATABASE — with automatic retry on transient failures
// ═══════════════════════════════════════════════════════════
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sql => sql.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null)
    )
);


// ═══════════════════════════════════════════════════════════
// JWT AUTHENTICATION
// ═══════════════════════════════════════════════════════════
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = false,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey         = new SymmetricSecurityKey(key),
            ClockSkew                = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();


// ═══════════════════════════════════════════════════════════
// RESPONSE COMPRESSION
// Reduces JSON payload by ~70-80% — critical for mobile users
// on slow 4G/LTE connections. Uses Brotli (modern) with Gzip fallback.
// ═══════════════════════════════════════════════════════════
builder.Services.AddResponseCompression(opts =>
{
    opts.EnableForHttps = true;
    opts.Providers.Add<BrotliCompressionProvider>();
    opts.Providers.Add<GzipCompressionProvider>();
    opts.MimeTypes = ResponseCompressionDefaults.MimeTypes
        .Concat(new[] { "application/json" });
});
builder.Services.Configure<BrotliCompressionProviderOptions>(o =>
    o.Level = CompressionLevel.Fastest);
builder.Services.Configure<GzipCompressionProviderOptions>(o =>
    o.Level = CompressionLevel.Fastest);


// ═══════════════════════════════════════════════════════════
// RATE LIMITING
// Protects against brute-force on login, DDoS, and API abuse.
// ═══════════════════════════════════════════════════════════
builder.Services.AddRateLimiter(opts =>
{
    // Global: 100 requests per minute per IP
    opts.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(ctx =>
        RateLimitPartition.GetSlidingWindowLimiter(
            ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new SlidingWindowRateLimiterOptions
            {
                PermitLimit          = 100,
                Window               = TimeSpan.FromMinutes(1),
                SegmentsPerWindow    = 6,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit           = 0
            }
        )
    );

    // Strict policy for auth endpoints: 10 attempts per minute per IP
    //opts.AddSlidingWindowLimiter("auth", o =>
    //{
    //    o.PermitLimit       = 10;
    //    o.Window            = TimeSpan.FromMinutes(1);
    //    o.SegmentsPerWindow = 4;
    //});

    opts.RejectionStatusCode = 429; // 429 Too Many Requests
});


// ═══════════════════════════════════════════════════════════
// CORS — read allowed origins from config so adding a new
// deployed URL is a config change, not a code change
// ═══════════════════════════════════════════════════════════
var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:4200", "https://localhost:4200" };

builder.Services.AddCors(opts =>
    opts.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
    )
);


// ═══════════════════════════════════════════════════════════
// RESPONSE CACHING — caches read-heavy responses server-side
// ═══════════════════════════════════════════════════════════
builder.Services.AddResponseCaching();


// ═══════════════════════════════════════════════════════════
// HEALTH CHECKS — GET /health → lets monitors / load balancers probe
// ═══════════════════════════════════════════════════════════
//builder.Services.AddHealthChecks()
//    .AddDbContextCheck<AppDbContext>("database");


// ═══════════════════════════════════════════════════════════
// CONTROLLERS
// ═══════════════════════════════════════════════════════════
builder.Services.AddControllers(opts =>
    opts.ReturnHttpNotAcceptable = true  // 406 for unsupported content types
);


// ═══════════════════════════════════════════════════════════
// REPOSITORIES
// ═══════════════════════════════════════════════════════════
builder.Services.AddScoped<IUserRepository,      UserRepository>();
builder.Services.AddScoped<IBookRepository,      BookRepository>();
builder.Services.AddScoped<IAllotmentRepository, AllotmentRepository>();
builder.Services.AddScoped<IBookLogRepository,   BookLogRepository>();


// ═══════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<BookService>();
builder.Services.AddScoped<AllotmentService>();
builder.Services.AddScoped<BookLogService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<RequestService>();


// ═══════════════════════════════════════════════════════════
// SWAGGER
// ═══════════════════════════════════════════════════════════
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title       = "BookAllotment API",
        Version     = "v1",
        Description = "Library management API — JWT secured"
    });

    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name         = "Authorization",
        Type         = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme       = "bearer",
        BearerFormat = "JWT",
        In           = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description  = "Enter: Bearer {your_jwt_token}"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {{
        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Reference = new Microsoft.OpenApi.Models.OpenApiReference
            {
                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                Id   = "Bearer"
            }
        },
        Array.Empty<string>()
    }});
});


// ═══════════════════════════════════════════════════════════
// BUILD + MIDDLEWARE PIPELINE
// ORDER MATTERS — compression must be first
// ═══════════════════════════════════════════════════════════
var app = builder.Build();

app.UseResponseCompression();   // ← must be before any response-producing middleware

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "BookAllotment API v1");
        c.DisplayRequestDuration();
    });
}

app.UseHttpsRedirection();

// ── Basic security headers ─────────────────────────────────────────────
app.Use(async (ctx, next) =>
{
    ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
    ctx.Response.Headers["X-Frame-Options"]        = "DENY";
    ctx.Response.Headers["Referrer-Policy"]        = "no-referrer";
    await next();
});

app.UseCors("AllowAngular");
app.UseResponseCaching();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
//app.MapHealthChecks("/health");

app.Run();
