using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SantralOpsAPI.DTOs;
using SantralOpsAPI.Entities;
using SantralOpsAPI.Persistence;

namespace SantralOpsAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(SantralOpsDbContext context, IConfiguration config, ILogger<AuthController> logger) : ControllerBase
{
  private readonly ILogger<AuthController> _logger = logger;
  private readonly SantralOpsDbContext _context = context;
  private readonly IConfiguration _config = config;

  // Post: api/Login
  [HttpPost("Login")]
  public async Task<ActionResult<LoginResponseDto>> Login(LoginDto loginDto)
  {
    var personel = await _context.Personeller.Include(p => p.Birim).FirstOrDefaultAsync(p => p.Eposta == loginDto.Eposta);

    if (personel == null)
    {
      return Unauthorized(new { status = 401, message = "Geçersiz e-posta veya şifre." });
    }

    if (!VerifyPasswordHash(loginDto.Sifre, personel.PasswordHash, personel.PasswordSalt))
    {
      return Unauthorized(new { status = 401, message = "Geçersiz e-posta veya şifre." });
    }

    var token = GenerateJwtToken(personel);

    return Ok(new LoginResponseDto
    {
      Token = token,
    });
  }

  private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
  {
    using var hmac = new HMACSHA512(passwordSalt);
    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    return computedHash.SequenceEqual(passwordHash);
  }

  private string GenerateJwtToken(Personel personel)
  {
    var claims = new List<Claim>
            {
                new("personalId", personel.Id.ToString()),
                new("personalAdSoyad", personel.AdSoyad),
                new("dahiliNo", personel.Dahili),
                new("birim", personel.Birim.Ad),
                new("unvan", personel.Unvan),
                new("eposta", personel.Eposta),
                new("rol", personel.Rol),
            };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(claims),
      Expires = DateTime.Now.AddHours(1),
      SigningCredentials = creds,
      Issuer = _config["Jwt:Issuer"],
      Audience = _config["Jwt:Audience"]
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    var token = tokenHandler.CreateToken(tokenDescriptor);

    return tokenHandler.WriteToken(token);
  }
}
