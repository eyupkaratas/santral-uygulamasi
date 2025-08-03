namespace SantralOpsAPI.DTOs;

public class TicketOlusturDto
{
  public string Konu { get; set; }
  public string Aciklama { get; set; }
  public string TalebiYapanKisiAdi { get; set; }
  public string TalebiYapanKisiNumarasi { get; set; }
  public int? AtananPersonelId { get; set; }
  public int OlusturanPersonelId { get; set; }
}
