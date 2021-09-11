using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos
{
    public class RedeSocialDto
    {
        public int Id { get; set; }   

        [Required (ErrorMessage ="Campo {0} e obrigatorio")]
        public string Nome { get; set; }

        [Required (ErrorMessage ="Campo {0} e obrigatorio")]
        public string URL { get; set; }
    }
}