import pytest
import unittest.mock as mock
from src.controllers.usercontroller import UserController

VALID_EMAIL = 'asd@gmail.com'
INVALID_EMAIL = 'invalidEmail.com'

@pytest.fixture
def setup_mock():
    mock_dao = mock.MagicMock()
    mock_user_controller = UserController(mock_dao)
    return mock_user_controller, mock_dao

@pytest.mark.unit
# One matching email.
def test_get_user_by_email_exists(setup_mock):
    mock_user_controller, mock_dao = setup_mock
    mock_dao.find.return_value = [{'email': VALID_EMAIL}]
    
    result = mock_user_controller.get_user_by_email(VALID_EMAIL)
    # print(result)
    assert result == {'email': VALID_EMAIL}

# Multiple matching emails
def test_get_user_by_email_exists_multiple(setup_mock, capsys):
    mock_user_controller, mock_dao = setup_mock
    mock_dao.find.return_value = [{'email': VALID_EMAIL}, {'email': VALID_EMAIL}]
    
    
    result = mock_user_controller.get_user_by_email(VALID_EMAIL)
    with capsys.disabled(): # Without this the error output assert won't pass.
        print(result)
    assert result == {'email': VALID_EMAIL}

    # Check if the warning message is printed.
    error_output = capsys.readouterr()
    assert error_output.out == f"Error: more than one user found with mail {VALID_EMAIL}\n"
    # print(error_output)

# # No matching emails
# # Gives error because get_user_by_email doesn't return None if there is no matches, indexerror. Fault in function.
def test_get_user_by_email_none(setup_mock):
    mock_user_controller, mock_dao = setup_mock
    mock_dao.find.return_value = []
    
    result = mock_user_controller.get_user_by_email(VALID_EMAIL)
    # print(result)
    assert result is None

# Invalid email
def test_get_user_by_email_invalid(setup_mock):
    mock_user_controller, mock_dao = setup_mock
    
    with pytest.raises(ValueError, match='Error: invalid email address'):
        mock_user_controller.get_user_by_email(INVALID_EMAIL)

# Dao returns exception, in case of db failed operation
def test_get_user_by_email_exception(setup_mock):
    mock_user_controller, mock_dao = setup_mock
    mock_dao.find.side_effect = Exception('Database operation failure')
    
    with pytest.raises(Exception, match= 'Database operation failure'):
        mock_user_controller.get_user_by_email(VALID_EMAIL)