using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ReactFluxModelState.Models
{
    public class Person
    {
        [Required]
        [Display(Name = "Nome da pessoa", Prompt = "O nome da pessoa, ex: André")]
        public string Name { get; set; }

        [Range(0, 200)]
        public int Age { get; set; }

        [Required, DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        public DateTime BirthDate { get; set; }

        [Required, MaxLength(5)]
        public ICollection<Pet> Pets { get; set; }

        //[Required, MaxLength(5)]
        //public ICollection<string> Tags { get; set; }
    }

    public class Pet
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public Species Species { get; set; }

        [Range(0, 50)]
        public int Age { get; set; }

        public DateTime BirthDate { get; set; }
    }

    public class Species
    {
        [Display(Name = "Espécie")]
        [Required(ErrorMessage = "Diga-nos a espécie do animal")]
        public string Name { get; set; }
    }
}