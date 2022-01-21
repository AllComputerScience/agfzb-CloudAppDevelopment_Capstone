from django.contrib import admin
from .models import CarMake, CarModel

# Register your models here.


# CarModelInline class

class ModelsInline(admin.StackedInline):
    model = CarModel
    extra = 9

class CarsAdmin(admin.ModelAdmin):
    field = ['name', 'description']
    inlines = [ModelsInline]

admin.site.register(CarMake, CarsAdmin)
admin.site.register(CarModel)

# CarModelAdmin class

# CarMakeAdmin class with CarModelInline

# Register models here
