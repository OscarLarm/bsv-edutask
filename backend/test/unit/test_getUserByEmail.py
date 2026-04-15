# created empty test file
from src.controllers.usercontroller import UserController
from unittest.mock import MagicMock
import pytest

# next step is to create fixture to always setup mock_dao and the controller
@pytest.fixture
def test_setup():
    mock_dao = MagicMock()
    user_controller = UserController(mock_dao)
    return mock_dao, user_controller

def test_get_user_by_email_Valid(test_setup):
    # arrange
    test_email = "hej@mail.com"
    mock_dao, user_controller = test_setup
    mock_dao.find.return_value = [{"email": test_email}]
    # act
    result = user_controller.get_user_by_email(test_email)
    print(result)

    # assert
    assert result == {"email": test_email}