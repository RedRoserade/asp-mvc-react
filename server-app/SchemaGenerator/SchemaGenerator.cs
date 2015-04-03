using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchemaGenerator
{
    public static class Generator
    {
		public static Dictionary<string, PropertySchema> Generate(Type t)
		{
			return t.GetProperties()
				.ToDictionary(p => p.Name, p => PropertySchema.FromProperty(p));
		}
	}
}
