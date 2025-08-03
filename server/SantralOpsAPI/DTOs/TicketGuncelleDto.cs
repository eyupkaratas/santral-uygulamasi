using SantralOpsAPI.Enums;

namespace SantralOpsAPI.DTOs;

public class TicketGuncelleDto
{
  public int? AtananPersonelId { get; set; }
  public TicketDurum? Durum { get; set; }
  public TicketOncelik? Oncelik { get; set; }
}
