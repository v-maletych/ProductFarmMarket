package com.productfarmmarket.enums;

public enum Raiting {
    ONE(1),
    TWO(2),
    THREE(3),
    FOUR(4),
    FIVE(5);

    private final int value;

    Raiting(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static Raiting fromValue(int value) {
        for (Raiting raiting : Raiting.values()) {
            if (raiting.value == value) {
                return raiting;
            }
        }
        throw new IllegalArgumentException("Invalid Raiting value: " + value);
    }
}