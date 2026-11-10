from pydantic import BaseModel, Field, field_validator


# =========================================================
# CREATE CUSTOMER
# =========================================================

class CustomerCreate(BaseModel):

    customerName: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Customer full name"
    )

    phoneNumber: str = Field(
        ...,
        min_length=10,
        max_length=10,
        description="10-digit customer phone number"
    )

    laptopType: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Laptop brand or type"
    )

    laptopIssue: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Laptop problem"
    )

    estimatedAmount: float = Field(
        ...,
        gt=0,
        description="Estimated service amount"
    )

    laptopGivenToClient: str = Field(
        ...,
        description="Whether laptop was given to the client"
    )

    chargerGivenToClient: str = Field(
        ...,
        description="Whether charger was given to the client"
    )

    # ---------------------------------------------------------
    # PHONE VALIDATION
    # ---------------------------------------------------------

    @field_validator("phoneNumber")
    @classmethod
    def validate_phone(cls, value: str) -> str:

        if not value.isdigit():
            raise ValueError(
                "Phone number must contain digits only"
            )

        if len(value) != 10:
            raise ValueError(
                "Phone number must contain exactly 10 digits"
            )

        return value

    # ---------------------------------------------------------
    # YES / NO VALIDATION
    # ---------------------------------------------------------

    @field_validator(
        "laptopGivenToClient",
        "chargerGivenToClient"
    )
    @classmethod
    def validate_yes_no(cls, value: str) -> str:

        if value not in ["Yes", "No"]:
            raise ValueError(
                "Value must be Yes or No"
            )

        return value


# =========================================================
# COMPLETE CUSTOMER SERVICE
# =========================================================

class CustomerComplete(BaseModel):

    finalAmount: float = Field(
        ...,
        gt=0,
        description="Final service amount"
    )

    laptopGivenToCustomer: str = Field(
        ...,
        description="Whether laptop was returned to customer"
    )

    chargerGivenToCustomer: str = Field(
        ...,
        description="Whether charger was returned to customer"
    )

    # ---------------------------------------------------------
    # YES / NO VALIDATION
    # ---------------------------------------------------------

    @field_validator(
        "laptopGivenToCustomer",
        "chargerGivenToCustomer"
    )
    @classmethod
    def validate_yes_no(cls, value: str) -> str:

        if value not in ["Yes", "No"]:
            raise ValueError(
                "Value must be Yes or No"
            )

        return value