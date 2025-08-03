namespace SantralOpsAPI.DTOs;

public class RandevuOzetDto
{
  public int Id { get; set; }
  public string Konu { get; set; }
  public DateTime BaslangicZamani { get; set; }
  public DateTime BitisZamani { get; set; }
  public string PersonelAdi { get; set; }
  public string KisiAdi { get; set; }
}
