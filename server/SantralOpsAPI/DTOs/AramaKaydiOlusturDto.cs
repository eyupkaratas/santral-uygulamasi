using SantralOpsAPI.Enums; 

namespace SantralOpsAPI.DTOs
{
 
  public class AramaKaydiOlusturDto
  {
    public string Numara { get; set; }
    public AramaYonu Yonu { get; set; }
    public int PersonelId { get; set; }
    public string Notlar { get; set; }


    public string? YeniKisiAdi { get; set; }
  }
}