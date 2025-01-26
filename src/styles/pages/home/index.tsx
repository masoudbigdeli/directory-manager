import styled from "@emotion/styled"


const HomeWrapper = styled.div({
    boxSizing: 'border-box',
    width: '30%',
    height:'100vh',
    border: '1px solid #000000',
    display:'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap:'0.5rem',
    paddingBlock:'0.5rem'

    
})


export default HomeWrapper


export const HeadersWrapper = styled.div({
    boxSizing: 'border-box',
    width: '90%',
    height:'3rem',
    border: '1px solid #000000',
    padding:'1rem',
    display:'flex',
    justifyContent:'flex-end'
});

export const BodyWrapper = styled.div({
    boxSizing: 'border-box',
    width: '90%',
    height:'40rem',
    border: '1px solid #000000',
    overflow:'auto',
    padding: '1rem',
    display:'flex',
    flexDirection:'column',
    gap: '0.3rem',
});

export const DirWrapper = styled.div({
    boxSizing: 'border-box',
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width: 'max-content',
    minWidth:'max-content',
    maxWidth:'max-content',
    height:'1.5rem',
    // border: '1px solid #000000',
    gap:'0.2rem'
});

export const DirNameWrapper = styled.div({
    boxSizing: 'border-box',
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width: 'max-content',
    minWidth:'max-content',
    maxWidth:'max-content',
    height:'1.5rem',
    // border: '1px solid #000000',
    gap:'0.2rem',
    '> .title':{
        // backgroundColor:'yellow',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        fontSize:'1rem',
        textOverflow: 'ellipsis',
        width: '6rem',
        minWidth: '6rem',
        maxWidth: '6rem',
        whiteSpace:'nowrap',
        overflow:'hidden',
        borderRadius: '1rem',
        padding:'0.25rem'
    },
    '> .icon':{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
});