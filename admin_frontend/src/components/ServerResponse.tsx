import Reblend, { IAny, useEffect, useState } from 'reblendjs';
import { AxiosResponse } from 'axios';
import Format from './Format';

function ServerResponse({ response }: { response: AxiosResponse }) {
  const [data, setData] = useState<IAny | null>(null);
  const [dataString, setDataString] = useState('');
  const [error, setError] = useState('');
  const [headers, setHeaders] = useState('');

  useEffect(() => {
    if (!response) return;
    if (typeof response.data == 'string') {
      setError(response.data);
    } else if (response.data) {
      setData(response.data);
      setDataString(JSON.stringify(response.data));
      setError('');
    } else {
      setError('Unknown error');
    }
    setHeaders(JSON.stringify(response.headers));
  }, [response]);

  return (
    <>
      <h4>Server response</h4>
      <div>
        {error && <object dangerouslySetInnerHTML={{ __html: error }}></object>}
      </div>
      <table class="responses-table live-responses-table">
        <thead>
          <tr class="responses-header">
            <td class="col_header response-col_status">Code</td>
            <td class="col_header response-col_description">Details</td>
          </tr>
        </thead>
        <tbody>
          <tr class="response">
            <td class="response-col_status">
              {data?.connection.statusCode || response?.status}
            </td>
            <td class="response-col_description">
              <div class="markdown">
                {data?.connection.message ?? response?.statusText}
              </div>

              {dataString && (
                <div>
                  <h5>Response body</h5>
                  <div class="highlight-code">
                    {/* <div class="copy-to-clipboard">
                    <button></button>
                  </div>
                  <button class="download-contents">Download</button> */}
                    {/* <pre
                    class="microlight"
                    style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(51, 51, 51); color: white;"
                  >
                    <code class="language-json" style="white-space: pre;">
                      Response bo
                    </code>
                  </pre> */}
                    <Format language="json" code={dataString} />
                  </div>
                </div>
              )}
              {headers && (
                <div>
                  <h5>Response headers</h5>
                  <Format language="json" code={headers} />
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default ServerResponse;
