from rest_framework import serializers
from .models import Category, Item, Stock_Transactions
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category
from rest_framework import serializers
from django.contrib.auth.models import User



class RegisterSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"non_field_errors": ["Passwords do not match."]})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user is associated with this email.")
        return value


class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(min_length=6, write_only=True)


class CategoryAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

    def validate_name(self, value):
        value = value.title()
        user = self.context['user']
        if Category.objects.filter(name__iexact=value, user=user).exists():
            raise serializers.ValidationError("Category already exists")
        return value


class CategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'    

class ItemListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Item
        fields = '__all__'

class ItemDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Item
        fields = [
            'id', 'name', 'sku', 'unit', 'current_stock',
            'description', 'status', 'created_at', 'category_name'
        ]

class ItemEditSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField()
    sku = serializers.CharField(required=False)

    class Meta:
        model = Item
        fields = ['name', 'sku', 'unit', 'current_stock', 'description', 'category_id']

    def validate_category_id(self, value):
        from .models import Category
        if not Category.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid category.")
        return value

    def update(self, instance, validated_data):
        from .models import Category
        category_id = validated_data.pop('category_id', None)
        if category_id:
            instance.category = Category.objects.get(id=category_id)
        return super().update(instance, validated_data)




class AddItemSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Item
        fields = ['name', 'category_id', 'unit', 'description', 'current_stock']

    def validate_name(self, value):
        value = value.title()
        user = self.context.get('user')
        if Item.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Item with this name already exists.")
        return value
    

class StockTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock_Transactions
        fields = ['name', 'type', 'quantity', 'notes']


class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.Name', read_only=True)
    class Meta:
        model = Item
        fields = ['id', 'name', 'category_name', 'current_stock']


class StockTransactionListSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='name.name', read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Stock_Transactions
        fields = ['item_name', 'type', 'quantity', 'created_at']
