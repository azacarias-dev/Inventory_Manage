using System;
using System.Threading.Tasks;
using AuthService.Api.Models;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace AuthService.Api.ModelBinders;

public class FileDataModelBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        ArgumentNullException.ThrowIfNull(bindingContext);

        if (!typeof(IFileData).IsAssignableFrom(bindingContext.ModelType))
        {
            bindingContext.Result = ModelBindingResult.Failed();
            return Task.CompletedTask;
        }

        var request = bindingContext.HttpContext.Request;

        if (!request.HasFormContentType)
        {
            bindingContext.Result = ModelBindingResult.Failed();
            return Task.CompletedTask;
        }

        var file = request.Form.Files.FirstOrDefault();

        if (file != null && file.Length > 0)
        {
            // Validación básica
            if (file.Length > 5 * 1024 * 1024)
            {
                bindingContext.ModelState.AddModelError(bindingContext.FieldName, "Archivo demasiado grande");
                bindingContext.Result = ModelBindingResult.Failed();
                return Task.CompletedTask;
            }

            var fileData = new FormFileAdapter(file);
            bindingContext.Result = ModelBindingResult.Success(fileData);
        }
        else
        {
            bindingContext.Result = ModelBindingResult.Success(null);
        }

        return Task.CompletedTask;
    }
}

public class FileDataModelBinderProvider : IModelBinderProvider
{
    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        if (typeof(IFileData).IsAssignableFrom(context.Metadata.ModelType))
        {
            return new FileDataModelBinder();
        }

        return null;
    }
}