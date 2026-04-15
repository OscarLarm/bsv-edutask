# created empty test file
from src.controllers.usercontroller import UserController
from unittest.mock import MagicMock

def test_get_user_by_email_True():
    # arrange
    mock_service = MagicMock()
    mock_service.find.return_value = [{"email": "hej@mail.com"}]
    user_controller = UserController(mock_service)
    # act
    result = user_controller.get_user_by_email("hej@mail.com")
    print(result)

    # assert
    assert result == {"email": "hej@mail.com"}