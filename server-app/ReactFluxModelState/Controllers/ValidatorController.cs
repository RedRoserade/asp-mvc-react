using ReactFluxModelState.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using ReactFluxModelState.ValidationHelpers;
using System.Web.Http;

namespace ReactFluxModelState.Controllers
{

    public class ValidatorController : ApiController
    {
        [Route("~/validation")]
        public IHttpActionResult Get()
        {
            var t = typeof(Person);

            var validationAttributes = t.GetProperties()
                .ToDictionary(p => p.Name, p => new
                {
                    type = Helpers.GetJavascriptPrototypeName(p.PropertyType),
                    validations = p.GetCustomAttributes(typeof(ValidationAttribute), false)
                        .Cast<ValidationAttribute>()
                        .Select(v => Helpers.FormatValidation(p, v))
                        .ToDictionary(k => k.Item1, k => k.Item2)
                });


            return Ok(validationAttributes);
        }

    }
}