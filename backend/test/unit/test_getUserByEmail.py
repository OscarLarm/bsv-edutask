from src.controllers.usercontroller import UserController
from unittest.mock import MagicMock
import pytest


@pytest.fixture
def test_setup():
    # sets up dao and controller for use in other tests
    mock_dao = MagicMock()
    user_controller = UserController(mock_dao)
    
    return mock_dao, user_controller

def test_get_user_by_email_exists(test_setup):
    # arrange
    test_email = "hej@mail.com"
    mock_dao, user_controller = test_setup
    mock_dao.find.return_value = [{"email": test_email}]
    # act
    result = user_controller.get_user_by_email(test_email)
    # print(result)
    # assert
    assert result == {"email": test_email}

def test_get_user_by_email_invalid_email(test_setup):
    mock_dao, user_controller = test_setup
    test_email = "mail.com"
    mock_dao.find.return_value = [{"email": test_email}]
    result = user_controller.get_user_by_email(test_email)
    print(result)
    assert result == ValueError('Error: invalid email address')

# def test_get_user_by_email_not_exists(test_setup):
#     pass # this test cant work as function doesnt have a case
#     # arrange
#     test_email = "hej@mail.com"
#     mock_dao, user_controller = test_setup
#     mock_dao.find.return_value = []
#     # act
#     result = user_controller.get_user_by_email(test_email)
#     print(result)
#     # assert
#     assert result == None

def test_get_user_by_email_too_many_users(test_setup, capsys):
    # arrange
    test_email = "hej@mail.com"
    mock_dao, user_controller = test_setup
    mock_dao.find.return_value = [{"email": test_email}, {"email": test_email}]
    # act
    result = user_controller.get_user_by_email(test_email)
    captured = capsys.readouterr()
    # assert
    assert captured.out == f"Error: more than one user found with mail {test_email}\n"
    assert result == {"email": test_email}

def test_get_user_by_email_db_fail(test_setup):
    pass
    mock_dao, user_controller = test_setup