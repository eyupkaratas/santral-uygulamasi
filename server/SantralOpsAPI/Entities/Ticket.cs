using SantralOpsAPI.Enums;

namespace SantralOpsAPI.Entities;

public class Ticket : BaseEntity
{
  public string Konu { get; set; }
  public string Aciklama { get; set; }
  public TicketDurum Durum { get; set; } = TicketDurum.Acik;
  public TicketOncelik Oncelik { get; set; } = TicketOncelik.Normal;
  public int TalebiYapanKisiId { get; set; }
  public virtual Kisi TalebiYapanKisi { get; set; }
  public int OlusturanPersonelId { get; set; }
  public virtual Personel OlusturanPersonel { get; set; }
  public int? AtananPersonelId { get; set; }
  public virtual Personel? AtananPersonel { get; set; }
}
