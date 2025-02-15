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
import DirectoryAndFileRenderer from "../../components/directory-renderer";
import PlusIcon from "../../components/icons/add-directory-icon";
import { DirectoryManager, FileManager } from "../../components/directory-renderer";
export default function Home() {
  const [treeObject, setTreeObject] = useState<DirectoryManager | FileManager | null >(null);
  const [textValue, setTextValue] = useState('');
  const handleOnEnter = useCallback((object: DirectoryManager | FileManager) => {
    if ((object as DirectoryManager).name === "__REMOVE__" || (object as FileManager).file?.name === "__REMOVE__") {
      setTreeObject(null);
    } else {
      setTreeObject(object);
    }
  }, []);
  const handleFileContentChange = useCallback((newContent: string) => {
    setTextValue(newContent);
  }, []);

  const handleSave = useCallback(() => {
    console.log(treeObject && (treeObject as FileManager).file)
    if (treeObject && Object.keys(treeObject).includes('file') && (treeObject as FileManager).file) {
      const fileName = (treeObject as FileManager).file!.name;
      const updatedFile = new File([textValue], fileName, {
        type: "text/plain",
      });
      console.log('fileName::::',fileName)
      setTreeObject({ ...treeObject, file: updatedFile });
      alert(`${fileName} changes saved! :)`);
    }
  }, [treeObject, textValue]);

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
            <DirectoryAndFileRenderer
              directoryOrFile={treeObject}
              onEnterHandler={handleOnEnter}
              fileContent={textValue}
              onFileContentChange={handleFileContentChange}
            />
          )}
        </BodyWrapper>
      </MenuWrapper>
        <EditorWrapper>
          <TextAreaWrapper
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          />
          <Button style={{border:'2px solid rgba(22, 21, 21, 0.24)',
                          width:'4rem', backgroundColor:'#009c82',
                          borderRadius:'1rem', display:'flex', alignItems:'center', justifyContent:'center', float:'right', 
                          padding:'0.75rem', margin:'0.3rem', cursor:'pointer' }} onClick={handleSave} >
            <span style={{color:'rgb(30, 59, 155)', fontSize:'1rem',}}>Save</span>
          </Button>
        </EditorWrapper>
    </HomeWrapper>
  );
}
