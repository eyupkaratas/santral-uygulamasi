namespace SantralOpsAPI.DTOs;

public class TicketOzetDto
{
  public int Id { get; set; }
  public string Konu { get; set; }
  public string Aciklama { get; set; }
  public string Durum { get; set; }
  public string Oncelik { get; set; }
  public int? AtananPersonelId { get; set; }
  public string TalebiYapanKisi { get; set; }
  public string OlusturanPersonel { get; set; }
  public string? AtananPersonel { get; set; }
  public DateTime CreatedDate { get; set; }
}
