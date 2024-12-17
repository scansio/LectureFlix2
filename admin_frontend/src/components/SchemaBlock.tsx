import Reblend, { useReducer } from 'reblendjs';
import Wrapper from './Wrapper';
import ModelContainer from './ModelContainer';

function SchemaBlock() {
  const [showAction, setShowAction] = useReducer(prev => !prev, true);

  return (
    <Wrapper>
      <section class="models">
        <h4 onclick={setShowAction}>
          <span>Models</span>
          <svg width="20" height="20">
            <use xlink:href="#large-arrow"></use>
          </svg>
        </h4>
        <noscript></noscript>
        {showAction ? <ModelContainer /> : null}
      </section>
    </Wrapper>
  );
}

export default SchemaBlock;
