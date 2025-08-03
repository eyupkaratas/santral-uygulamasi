namespace SantralOpsAPI.DTOs;

public class KargoOzetDto
{
  public int Id { get; set; }
  public string? TakipNumarasi { get; set; }
  public string Gonderen { get; set; }
  public string Aciklama { get; set; }
  public string Durum { get; set; }
  public string TeslimAlanPersonelAdi { get; set; }
  public DateTime CreatedDate { get; set; }
  public DateTime? TeslimTarihi { get; set; }
}

