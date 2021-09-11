using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        [Required (ErrorMessage ="Campo Obrigatorio")]
        [StringLength (100, MinimumLength =3, ErrorMessage ="Local e entre 3 e 100 caracteres")]
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required (ErrorMessage ="O Tema Deve ser preenchido")]
        public string Tema { get; set; }

        [Range(2, 12000, ErrorMessage ="Quantidade de pessoas e entre 2 e 12000")]
        public int QntdPessoas { get; set; }
        public string ImagemURL { get; set; }

        [Phone(ErrorMessage ="Telefone Invalido")]
        public string Telefone { get; set; }

        [EmailAddress(ErrorMessage ="Campo email invalido")]
        public string Email { get; set; }
        public string Lote { get; set; }
        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedeSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}