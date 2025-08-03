namespace SantralOpsAPI.DTOs;

public class KargoGirisDto
{
  public string Gonderen { get; set; }
  public string Aciklama { get; set; }
  public string? TakipNumarasi { get; set; }
  public int TeslimAlanPersonelId { get; set; }
}
