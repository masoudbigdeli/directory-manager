import HomeWrapper, {
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
    </HomeWrapper>
  );
}
