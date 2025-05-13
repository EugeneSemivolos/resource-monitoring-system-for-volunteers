import os
import django

# Налаштування Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Volunteer

def delete_user_by_email(email):
    """
    Повністю видаляє користувача за email з обох таблиць: User і Volunteer
    """
    print(f"Пошук користувача з email: {email}")
    
    # Перевірка, чи існує волонтер з таким email
    volunteer_exists = Volunteer.objects.filter(email=email).exists()
    print(f"Волонтер з email {email} існує: {volunteer_exists}")
    
    # Перевірка, чи існує користувач Django з таким email
    user_exists = User.objects.filter(email=email).exists()
    print(f"Користувач Django з email {email} існує: {user_exists}")
    
    # Видалення волонтера (якщо існує)
    if volunteer_exists:
        volunteer = Volunteer.objects.get(email=email)
        print(f"Знайдено волонтера: {volunteer.first_name} {volunteer.last_name}")
        volunteer.delete()
        print(f"Волонтера з email {email} видалено.")
    
    # Видалення користувача Django (якщо існує)
    if user_exists:
        user = User.objects.get(email=email)
        print(f"Знайдено користувача Django: {user.username}")
        user.delete()
        print(f"Користувача Django з email {email} видалено.")
    
    # Фінальна перевірка
    volunteer_exists_after = Volunteer.objects.filter(email=email).exists()
    user_exists_after = User.objects.filter(email=email).exists()
    
    if not volunteer_exists_after and not user_exists_after:
        print(f"Користувача з email {email} повністю видалено з системи.")
    else:
        print(f"ПОМИЛКА: не вдалося повністю видалити користувача!")
        if volunteer_exists_after:
            print(f"Волонтер все ще існує в базі даних!")
        if user_exists_after:
            print(f"Користувач Django все ще існує в базі даних!")

if __name__ == "__main__":
    email = input("Введіть email користувача для видалення: ")
    delete_user_by_email(email) 