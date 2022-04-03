import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import BuyStoneCard from '../../components/Stones/BuyStoneCard';
import SearchIcon from "@mui/icons-material/Search";
import { useInView } from "react-intersection-observer";
import { loadStoneList, resetStoneList } from '../../actions';


//아직 서버데이터 없어서 임의로 만든 dummyData
import dummyData from "../../dummyData/dummyData";

export function BuyStone() {
    /* state
loading: 로딩중 true 로딩완료 false
loadAll: 서버가 응답한 결과값이 20개 미만이면 모두 검색된 것이므로 true면 더이상 요청 안보내게 
startIdx: 불러오는 Idx의 시작점 20개씩 증가
keyword: 서버에 요청할 검색어, search시 현재 검색input창에 있는 값으로 갱신
*/
    const [loading, setLoading] = useState(true);
    const [loadAll, setLoadAll] = useState(false);
    const [startIdx, setStartIdx] = useState(0);
    const [keyword, setKeyword] = useState("");

    //scroll체크
    const [ref, inView] = useInView();

    const account = useSelector((state) => state.accountReducer);
    const stoneList = useSelector((state) => state.buyStoneReducer);
    const dispatch = useDispatch();
    const keywordInput = useRef();

    /*서버에서 musician 데이터 불러오기
    const loadMusicians = () => {
        const server = process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";
        const req = `${server}/musician?startIndex=${startIdx}&endIndex=${startIdx + 19}&keyword=${keyword}`

        axios.get(req)
            .then((res) => {
                setLoading(true);
                const musicianData = res.data.data;
                dispatch(loadStoneList(musicianData));
                if (musicianData.length < 20) setLoadAll(true);

                setStartIdx(startIdx + 20);
                setLoading(false);
            })
    }*/
    //서버에서 판매중인 stone 불러오기
    const loadStones = () => {
        const server = process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";
        const req = `${server}/stones/buystone/`
        setLoading(true);
        //여기는 dummyData 로딩부분
        const tempArr = [];
        for (let i = startIdx;
            i < (dummyData.buyStone.length > startIdx + 20 ? startIdx + 20 : dummyData.buyStone.length);
            i++) {
            tempArr.push(dummyData.buyStone[i]);
        }
        dispatch(loadStoneList(tempArr));

        setStartIdx(startIdx + 20);
        setLoading(false);
    }
    const showStones = () => {
        return (stoneList.stones.map((stone, idx) => {
            return <BuyStoneCard stone={stone} />
        }))
    }

    const handleInputEnter = (e) => {
        if (e.key == 'Enter') {
            search();
        }
    }

    const search = () => {
        setKeyword(keywordInput.current.value);
    }

    useEffect(() => {
        // 보여줄 결과가 남아 있을때 스크롤이 마지막이고 로딩 중이 아니면 load
        if (inView && !loading && !loadAll && startIdx !== 1) {
            loadStones();
        }
    }, [inView, loading]);

    //검색어 입력시
    useEffect(() => {
        setLoadAll(false);
    }, [keyword]);

    useEffect(() => {
        setStartIdx(1);
        if (!loadAll) {
            dispatch(resetStoneList());
            loadStones();
        }
    }, [loadAll]);

    return (
        <Body>
            <StoneContainer>
                <Nav>
                    <Title><h1>Collect Your Stones</h1></Title>
                    {/*가격변동은 시간관계상 보류하기로 함
                    <Notify>* 가격변동률은 전일의 평균 거래가 기준으로 산출됩니다. </Notify>
                    */}
                    <Notify>{account.isConnect ? ' ' : '* 나의 stone 보유량을 보려면 지갑을 연결해주세요'}</Notify>
                    <SearchWrap>
                        <SearchInput ref={keywordInput} type="text" placeholder="찾는 음원이나 뮤지션을 검색해 주세요." onKeyPress={handleInputEnter} />
                        <SearchButton onClick={search}>
                            <SearchIcon />
                        </SearchButton>
                    </SearchWrap>
                </Nav>
                <StonesWrapper>
                    {showStones()}
                </StonesWrapper>
            </StoneContainer>
            <div id="observer" ref={ref}> </div>
        </Body>
    );
}

//여기부터 styled
const Body = styled.div`
height: 100%;
margin-top: 2rem;
`;

const StoneContainer = styled.div`
display:flex;
flex-direction: column;
margin: 0 auto;
`;
const Nav = styled.div`
display: flex;
flex-direction: column;
width: 980px;
margin: 0 auto;
`;
const Title = styled.div`
margin: 0 auto;
`;
const Notify = styled.span`
height: 20px;
font-size: 0.8rem;
white-space: pre;
`;
const SearchWrap = styled.div`
position: relative;
display: flex;
justify-content: flex-end;
`;

const SearchInput = styled.input`
width: 300px;
border: 3px solid #848cb5;
border-right: none;
padding: 5px;
height: 20px;
border-radius: 10px 0 0 10px;
outline: none;
color: #6b6b84;
&:focus {
color: #3b3b54;
}
`;
const SearchButton = styled.button`
  width: 40px;
  height: 36px;
  border: 1px solid #848cb5;
  background: #848cb5;
  text-align: center;
  color: #fff;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  font-size: 20px;
`;
const StonesWrapper = styled.div`
width: 980px;
margin: 0 auto;
display: flex;
flex-wrap: wrap;
justify-content: space-around;
`;
