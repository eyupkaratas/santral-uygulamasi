using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SantralOpsAPI.DTOs;
using SantralOpsAPI.Persistence;

namespace SantralOpsAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BirimlerController(SantralOpsDbContext context) : ControllerBase
{
  private readonly SantralOpsDbContext _context = context;

  // GET: api/Birimler
  [HttpGet]
  public async Task<ActionResult<IEnumerable<BirimDto>>> GetBirimler()
  {
    var birimler = await _context.Birimler.ToListAsync();

    var birimDtos = birimler.Select(birim => new BirimDto
    {
      Id = birim.Id,
      Ad = birim.Ad,
    }).ToList();

    return Ok(birimDtos);
  }
}
