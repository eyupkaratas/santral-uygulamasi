namespace SantralOpsAPI.DTOs;

public class RandevuOlusturDto
{
  public string Konu { get; set; }
  public DateTime BaslangicZamani { get; set; }
  public DateTime BitisZamani { get; set; }
  public int PersonelId { get; set; }
  public int KisiId { get; set; }
}
