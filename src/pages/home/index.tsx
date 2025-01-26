import HomeWrapper,{HeadersWrapper, BodyWrapper, DirWrapper, DirNameWrapper} from "../../styles/pages/home";
import FolderIcon from "../../components/icons/folder-icon";
export default function Home() {
  return (
    <HomeWrapper>
        <HeadersWrapper>
            icon
        </HeadersWrapper>
        <BodyWrapper>
            <DirWrapper>Folder<div>dd</div></DirWrapper>
            <DirWrapper>Folder</DirWrapper>
            <DirWrapper>Folder</DirWrapper>
            <DirWrapper>Folder</DirWrapper>
            <DirWrapper>Folder</DirWrapper>
            <DirWrapper>

                <DirNameWrapper>
                    <div className="icon" style={{width:'1.5rem'}}>
                    <FolderIcon/>
                    </div>
                    <div className='title'>asghar ba pedarash be khane raft chera nagereft??</div>
                </DirNameWrapper>
            </DirWrapper>
        </BodyWrapper>
    </HomeWrapper>
  );
};
