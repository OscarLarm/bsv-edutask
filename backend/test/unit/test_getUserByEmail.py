# created empty test file
from src.controllers.usercontroller import UserController
from unittest.mock import MagicMock

# next step is to create fixture to always setup mock_dao and the controller

def test_get_user_by_email_Valid():
    # arrange
    test_email = "hej@mail.com"
    mock_dao = MagicMock()
    mock_dao.find.return_value = [{"email": test_email}]
    user_controller = UserController(mock_dao)
    # act
    result = user_controller.get_user_by_email(test_email)
    print(result)

    # assert
    assert result == {"email": test_email}