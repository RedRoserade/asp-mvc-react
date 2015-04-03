using SchemaGenerator.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace SchemaGenerator
{
	public class PropertySchema
	{
		public PropertySchema() { }

		public PropertySchema(PropertyInfo p)
		{
			type = ValidationHelper.GetJavascriptType(p.PropertyType);
			label = PropertyHelper.GetDisplayName(p);
			placeholder = PropertyHelper.GetPlaceholder(p);
			validations = p.GetCustomAttributes(typeof(ValidationAttribute), false)
				.Cast<ValidationAttribute>()
				.Select(v => ValidationHelper.FormatValidation(p, v))
				.ToDictionary(k => k.Item1, k => k.Item2);
		}

		public string label { get; set; }
		public string placeholder { get; set; }
		public string type { get; set; }

		public IDictionary<string, object> validations { get; set; }

		/// <summary>
		/// Generates a PropertySchema for the specified
		/// property.
		/// </summary>
		/// <param name="p"></param>
		/// <returns></returns>
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
				.Select(name => new SelectItem<string>
				{
					value = name,
					text = PropertyHelper.GetDisplayName(enumType.GetField(name))
				});
		}

		public IEnumerable<SelectItem<string>> enumValues { get; set; }
	}

	public class SelectItem<T>
	{
		public T value { get; set; }
		public string text { get; set; }
	}
}
