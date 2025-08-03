namespace SantralOpsAPI.DTOs
{

    public class GenelAramaKaydiDto
    {
        public int Id { get; set; }
        public string KisiAdSoyad { get; set; }
        public string Numara { get; set; }
        public string Yonu { get; set; }
        public DateTime AramaZamani { get; set; }
        public string PersonelAdi { get; set; }
        public string Notlar { get; set; }
    }
}