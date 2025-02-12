import HomeWrapper, {
  MenuWrapper,
  TextAreaWrapper,
  EditorWrapper,
  Button,
  HeadersWrapper,
  BodyWrapper,
  StatusButtons,
} from "../../styles/pages/home";
import { useCallback, useState } from "react";
import DirectoryRenderer from "../../components/directory-renderer";
import PlusIcon from "../../components/icons/add-directory-icon";
import { DirectoryManager, FileManager } from "../../components/directory-renderer";
export default function Home() {
  const [treeObject, setTreeObject] = useState<DirectoryManager | FileManager | null >(null);
  const handleOnEnter = useCallback((object: DirectoryManager | FileManager) => {
    if ((object as DirectoryManager).name === "__REMOVE__" || (object as FileManager).file?.name === "__REMOVE__") {
      setTreeObject(null);
    } else {
      setTreeObject(object);
    }
  }, []);

  return (
    <HomeWrapper>
      <MenuWrapper>
        <HeadersWrapper>
          <span>Directory Manager</span>
          {!treeObject ? (
            <StatusButtons
              onClick={(e) => {
                setTreeObject({
                  id: crypto.randomUUID(),
                  name: e.currentTarget.value,
                  children: [],
                  layerIndex: 0,
                  isExtended: true,
                });
              }}
            >
              <PlusIcon />
            </StatusButtons>
          ) : null}
        </HeadersWrapper>
        <BodyWrapper>
          {treeObject && (
            <DirectoryRenderer
              directoryOrFile={treeObject}
              onEnterHandler={handleOnEnter}
            />
          )}
        </BodyWrapper>
      </MenuWrapper>
        <EditorWrapper>
          <TextAreaWrapper>
          </TextAreaWrapper>
          <Button style={{border:'2px solid rgba(22, 21, 21, 0.24)',
                          width:'4rem', backgroundColor:'#009c82',
                          borderRadius:'1rem', display:'flex', alignItems:'center', justifyContent:'center', float:'right', 
                          padding:'0.75rem', margin:'0.3rem' }} >
            <span style={{color:'rgb(30, 59, 155)', fontSize:'1rem',}}>Save</span>
          </Button>
        </EditorWrapper>
    </HomeWrapper>
  );
}
