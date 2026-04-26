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
    dao.drop() # drop table to reset db additions

@pytest.mark.integration
def test_create_with_required_props(fixture_setup_dao):
    # passing test with required props
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

def test_create_missing_props(fixture_setup_dao):
    # email is missing so test should throw an exception
    invalid_data = {
        "firstName": "John",
        "lastName": "Doe"
    }
    dao = fixture_setup_dao
    with pytest.raises(Exception):
        dao.create(invalid_data)

def test_create_bson_invalid_data_types(fixture_setup_dao):
    # test bson data type constraints, validator should only allow these to be strings
    invalid_type_data = {
        "firstName": 5,
        "lastName": "Doe",
        "email": "john.doe@gmail.com"
    }
    dao = fixture_setup_dao
    with pytest.raises(Exception):
        dao.create(invalid_type_data)

def test_create_unique_items(fixture_setup_dao):
    # test out the uniqueItems email property. 
    # this test fails because of the validator are not doing its job
    unique_data = {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@gmail.com"
    }
    dao = fixture_setup_dao
    dao.create(unique_data) # create first user with unique emails
    
    not_unique_data = {
        "firstName": "Lasse",
        "lastName": "Svensson",
        "email": "john.doe@gmail.com"
    }
    with pytest.raises(Exception): # this should throw an error because of email not being unique
        dao.create(not_unique_data)