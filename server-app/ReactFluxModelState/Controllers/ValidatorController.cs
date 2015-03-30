using ReactFluxModelState.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using ReactFluxModelState.ValidationHelpers;
using System.Web.Http;
using System.Web.Http.Cors;
using Newtonsoft.Json;
using System.Reflection;

namespace ReactFluxModelState.Controllers
{

    public class ValidatorController : ApiController
    {
        public IDictionary<string, Type> Schemas = new Dictionary<string, Type>
            {
                { "Person", typeof(Person) },
                { "Species", typeof(Species) },
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

        private Dictionary<string, PropertySchema> GetValidations(Type t)
        {
            var validationAttributes = t.GetProperties()
                .ToDictionary(p => p.Name, p => PropertySchema.FromProperty(p));

            return validationAttributes;
        }
    }

    public class PropertySchema
    {
        public PropertySchema() { }

        public PropertySchema(PropertyInfo p)
        {
            this.type = Helpers.GetJavascriptPrototypeName(p.PropertyType);
            this.label = Helpers.GetDisplayName(p);
            this.placeholder = Helpers.GetPlaceholder(p);
            this.validations = p.GetCustomAttributes(typeof(ValidationAttribute), false)
                .Cast<ValidationAttribute>()
                .Select(v => Helpers.FormatValidation(p, v))
                .ToDictionary(k => k.Item1, k => k.Item2);
        }

        public string label { get; set; }
        public string placeholder { get; set; }
        public string type { get; set; }

        public IDictionary<string, object> validations { get; set; }

        public static PropertySchema FromProperty(PropertyInfo p)
        {
            if (p.PropertyType.IsEnum)
            {
                return new EnumPropertySchema(p);
            }

            return new PropertySchema(p);
        }
    }

    public class EnumPropertySchema : PropertySchema
    {
        public EnumPropertySchema() : base() { }

        public EnumPropertySchema(PropertyInfo p)
            : base(p)
        {
            var enumType = p.PropertyType;

            this.enumValues = Enum.GetNames(enumType)
                .Select(name => new SelectItem
                {
                    value = name,
                    text = Helpers.GetDisplayName(enumType.GetField(name))
                });
        }

        public IEnumerable<SelectItem> enumValues { get; set; }
    }

    public class SelectItem
    {
        public object value { get; set; }
        public string text { get; set; }
    }
}