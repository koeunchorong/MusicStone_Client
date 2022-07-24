const initialAccount = {
  account: "지갑을 연결하세요.",
  isConnect: false,
  userId: 0,
};

const ON_CONNECT = "ON_CONNECT";
const GET_USERID = "GET_USERID";
function accountReducer(state = initialAccount, action) {
  switch (action.type) {
    case ON_CONNECT:
      const newState = {
        ...state,
        account: String(action.account),
        isConnect: true,
      };
      return newState;
    case GET_USERID:
      const newState2 = {
        ...state,
        userId: action.userId,
      };
      return newState2;
    default:
      return state;
  }
}

export default accountReducer;
