using ReactFluxModelState.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using ReactFluxModelState.ValidationHelpers;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ReactFluxModelState.Controllers
{

    public class ValidatorController : ApiController
    {
        public IDictionary<string, Type> Schemas = new Dictionary<string, Type>
            {
                { "Person", typeof(Person) },
                { "Pet", typeof(Pet) }
            };

        [Route("~/validation/{schemaName}")]
        [EnableCors("*", "*", "*")]
        public IHttpActionResult Get(string schemaName)
        {
            if (Schemas.ContainsKey(schemaName))
            {
                return Ok(GetValidations(Schemas[schemaName]));
            }

            return NotFound();
        }


        private Dictionary<string, ValidationSchema> GetValidations(Type t)
        {
            var validationAttributes = t.GetProperties()
                .ToDictionary(p => p.Name, p => new ValidationSchema
                {
                    type = Helpers.GetJavascriptPrototypeName(p.PropertyType),
                    validations = p.GetCustomAttributes(typeof(ValidationAttribute), false)
                        .Cast<ValidationAttribute>()
                        .Select(v => Helpers.FormatValidation(p, v))
                        .ToDictionary(k => k.Item1, k => k.Item2)
                });

            return validationAttributes;
        }
    }

    public class ValidationSchema
    {
        public string type { get; set; }
        public IDictionary<string, object> validations { get; set; }
    }
}