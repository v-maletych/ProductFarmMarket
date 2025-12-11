package com.productfarmmarket.enums;

public enum Raiting {
    // Кожна константа enum тепер має асоційоване числове значення
    ONE(1),
    TWO(2),
    THREE(3),
    FOUR(4),
    FIVE(5);

    private final int value;

    // Приватний конструктор для асоціації значення
    Raiting(int value) {
        this.value = value;
    }

    /**
     * Повертає числове представлення рейтингу.
     * Необхідно для коректного розрахунку середнього балу.
     * @return числове значення рейтингу (1-5)
     */
    public int getValue() {
        return value;
    }
    
    /**
     * Статичний метод для отримання Raiting за його числовим значенням.
     * @param value числове значення
     * @return Raiting enum
     * @throws IllegalArgumentException якщо значення недійсне
     */
    public static Raiting fromValue(int value) {
        for (Raiting raiting : Raiting.values()) {
            if (raiting.value == value) {
                return raiting;
            }
        }
        throw new IllegalArgumentException("Invalid Raiting value: " + value);
    }
}