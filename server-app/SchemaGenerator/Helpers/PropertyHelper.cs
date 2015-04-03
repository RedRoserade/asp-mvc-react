using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SchemaGenerator.Helpers
{
	static class PropertyHelper
	{
		public static string GetDisplayName(MemberInfo p)
		{
			var display = p.GetCustomAttribute<DisplayAttribute>();

			if (display == null)
			{
				return p.Name;
			}

			return display.GetName();
		}

		public static string GetPlaceholder(PropertyInfo p)
		{
			var display = p.GetCustomAttribute<DisplayAttribute>();

			if (display == null)
			{
				return "";
			}

			return display.GetPrompt() ?? "";
		}

	}
}
