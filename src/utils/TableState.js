import { useGridApiRef } from "@mui/x-data-grid";
import { useCallback, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Custom hook definition for saving grid state
function useSaveGridState(selector, actionCreator) {
  const dispatch = useDispatch();
  const selectedState = useSelector(selector);
  const apiRef = useGridApiRef();

  const saveSnapshot = useCallback(() => {
    if (apiRef?.current?.state) {
      const currentState = apiRef.current.state;
      const defaultVisibilityModel = currentState.columns.columnVisibilityModel;
      Object.keys(defaultVisibilityModel).forEach((key) => {
        if (defaultVisibilityModel[key] === false) {
          defaultVisibilityModel[key] = true;
        }
      });
      dispatch(
        actionCreator({
          ...currentState,
          columns: {
            ...currentState.columns,
            columnVisibilityModel: defaultVisibilityModel,
          },
        })
      );
    }
  }, [apiRef]);

  useLayoutEffect(() => {
    // handle refresh and navigating away/refreshing
    window.addEventListener("beforeunload", saveSnapshot);

    return () => {
      // in case of an SPA remove the event-listener
      window.removeEventListener("beforeunload", saveSnapshot);
      saveSnapshot();
    };
  }, [saveSnapshot]);

  return { selectedState, apiRef };
}

export default useSaveGridState;
