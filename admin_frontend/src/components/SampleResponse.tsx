import Reblend, { useReducer } from 'reblendjs';
import ISampleResponse from '../interfaces/ISampleResponse';
import Format from './Format';

function SampleResponse({ samples }: { samples?: ISampleResponse[] }) {
  const [showAction, setShowAction] = useReducer(prev => !prev, false);

  return (
    <>
      <h4 onclick={setShowAction} style="cursor: pointer; padding-top: 5px">
        Sample Responses
      </h4>
      <hr />
      {showAction ? (
        <table class="responses-table">
          <thead>
            <tr class="responses-header">
              <td class="col col_header response-col_status">Code</td>
              <td class="col col_header response-col_description">
                Description
              </td>
            </tr>
          </thead>
          <tbody>
            {samples?.map(sample => (
              <tr class="response " data-code={sample.statusCode}>
                <td class="col response-col_status">{sample.statusCode}</td>
                <td class="col response-col_description">
                  <div class="response-col_description__inner">
                    <div class="renderedMarkdown">
                      <p>{sample.description}</p>
                    </div>
                  </div>
                  <div class="model-example">
                    <div>
                      <Format language="json" code={sample.content} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </>
  );
}

export default SampleResponse;
