using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Web;

namespace ReactFluxModelState.ValidationHelpers
{
    public static class Helpers
    {
        public static string GetJavascriptPrototypeName(Type t)
        {
            if (t.IsAssignableFrom(typeof(int)) ||
                t.IsAssignableFrom(typeof(byte)) ||
                t.IsAssignableFrom(typeof(sbyte)) ||
                t.IsAssignableFrom(typeof(uint)) ||
                t.IsAssignableFrom(typeof(long)) ||
                t.IsAssignableFrom(typeof(ulong)))
            {
                return "integer";
            }

            if (t.IsAssignableFrom(typeof(double)) ||
                t.IsAssignableFrom(typeof(float)))
            {
                return "number";
            }

            if (t.IsAssignableFrom(typeof(string)))
            {
                return "string";
            }

            if (t.IsAssignableFrom(typeof(bool)))
            {
                return "boolean";
            }

            if (t.IsAssignableFrom(typeof(DateTime)))
            {
                return "date";
            }

            if (typeof(IEnumerable).IsAssignableFrom(t))
            {
                return string.Format("array<{0}>",
                    string.Join(",", t.GetGenericArguments()
                        .Select(a => a.Name)));
            }

            return t.Name;
        }

        public static Tuple<string, object> FormatValidation(PropertyInfo p, ValidationAttribute attribute)
        {
            if (attribute is DataTypeAttribute)
            {
                return GetDataTypeValidation(p, attribute as DataTypeAttribute);
            }
            else if (attribute is RequiredAttribute)
            {
                var required = attribute as RequiredAttribute;

                return new Tuple<string, object>("required", new
                    {
                        allowEmpty = required.AllowEmptyStrings,
                        message = required.FormatErrorMessage(p.Name)
                    });
            }
            else if (attribute is RangeAttribute)
            {
                var range = attribute as RangeAttribute;

                return new Tuple<string, object>("range", new
                    {
                        minValue = range.Minimum,
                        maxValue = range.Maximum,
                        message = range.FormatErrorMessage(p.Name)
                    });
            }
            else if (attribute is MinLengthAttribute)
            {
                var minLength = attribute as MinLengthAttribute;

                return new Tuple<string, object>("minLength", new
                    {
                        length = minLength.Length,
                        message = minLength.FormatErrorMessage(p.Name)
                    });
            }
            else if (attribute is MaxLengthAttribute)
            {
                var maxLength = attribute as MaxLengthAttribute;

                return new Tuple<string, object>("maxLength", new
                {
                    length = maxLength.Length,
                    message = maxLength.FormatErrorMessage(p.Name)
                });
            }
            else if (attribute is RangeAttribute)
            {
                var range = attribute as RangeAttribute;

                return new Tuple<string, object>("maxLength", new
                {
                    minimum = range.Minimum,
                    maximum = range.Maximum,
                    message = range.FormatErrorMessage(p.Name)
                });
            }
            else if (attribute is RegularExpressionAttribute)
            {
                var regExp = attribute as RegularExpressionAttribute;

                return new Tuple<string, object>("regExp", new
                {
                    pattern = regExp.Pattern,
                    message = regExp.FormatErrorMessage(p.Name)
                });
            }

            throw new Exception();
        }

        private static Tuple<string, object> GetDataTypeValidation(PropertyInfo p, DataTypeAttribute attr)
        {
            if (attr.DataType == DataType.EmailAddress)
            {
                return new Tuple<string, object>("emailAddress", new
                    {
                        message = new EmailAddressAttribute().FormatErrorMessage(p.Name)
                    });
            }

            throw new Exception();
        }
    }
}
