# from src.util.dao import DAO
import unittest.mock as mock
import pytest
from src.util.dao import DAO

# 1. validator makes sure that object contains all required properties
# 2. every property complies to bson data type constraint (strings & bools?)
# 3. values of properties flagged with "uniqueItems" need to be unique among all documents (email)

@pytest.fixture
def fixture_setup_dao():
    dao = DAO("user") # setup db connection
    yield dao # remove dao object
    # dao.drop()

@pytest.mark.integration
def test_create_with_required_props(fixture_setup_dao):
    # fixture_db_interaction
    test_data = {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@gmail.com"
    }
    dao = fixture_setup_dao
    result = dao.create(test_data)
     
    assert result["firstName"] == "John"
    assert result["lastName"] == "Doe"
    assert result["email"] == "john.doe@gmail.com"