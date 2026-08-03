from __future__ import annotations

from functools import lru_cache
import random
from datetime import date
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.routes import FinancialMovement, OperationType, Category, BusinessType


def _build_movement(month: int, income_probability: float, today: date):
    from app.routes import FinancialMovement, OUTCOME_CATEGORIES
    target_year = today.year
    day = random.randint(1, 28)
    movement_date = date(target_year, month, day)

    operation_type: OperationType = (
        "income" if random.random() < income_probability else "outcome"
    )
    business_type: BusinessType = "B2B" if random.random() < 0.6 else "B2C"

    if operation_type == "income":
        category: Category = "sales"
        amount = round(random.uniform(800, 12000), 2)
    else:
        category = random.choice(OUTCOME_CATEGORIES)
        amount = round(random.uniform(500, 9000), 2)

    return FinancialMovement(
        create_date=movement_date,
        amount=amount,
        operation_type=operation_type,
        category=category,
        business_type=business_type,
    )


def generate_mock_movements(seed: int | None = None) -> list[FinancialMovement]:
    if seed is not None:
        random.seed(seed)
    today = date.today()
    movements: list = []
    for month in range(1, 13):
        income_probability = random.uniform(0.45, 0.7)
        for _ in range(30):
            movements.append(_build_movement(month, income_probability, today))
    movements.sort(key=lambda item: item.create_date)
    return movements


@lru_cache(maxsize=1)
def get_cached_mock_movements(seed: int = 42) -> list[FinancialMovement]:
    return generate_mock_movements(seed=seed)
