// Test cases for processCustomPatterns function

function processCustomPatterns(input: string): string {
  return input
    // Convert [doc-(id)] and [doc-id] to HTML that react-markdown can parse
    .replace(/\[doc-(?:\()?([^)\]]+)(?:\))?\]/g, '<span class="custom-doc-placeholder" data-id="$1"></span>')
    .replace(/\[docsum-(?:\()?([^)\]]+)(?:\))?\]/g, '<span class="custom-docsum-placeholder" data-id="$1"></span>')
    // Convert [link-(url)] and [link-url] to HTML that react-markdown can parse  
    .replace(/\[link-(?:\()?([^)\]]+)(?:\))?\]/g, '<span class="custom-link-placeholder" data-url="$1"></span>');
}

// Test cases
const testCases = [
  {
    name: 'doc with parentheses',
    input: 'Check [doc-(abc123)]',
    expected: 'Check <span class="custom-doc-placeholder" data-id="abc123"></span>',
  },
  {
    name: 'doc with parentheses uuid',
    input: 'Check [doc-(abc123-alksjdaksjd-123890123-ansdlkansd)]',
    expected: 'Check <span class="custom-doc-placeholder" data-id="abc123-alksjdaksjd-123890123-ansdlkansd"></span>',
  },
  {
    name: 'doc without parentheses',
    input: 'Check [doc-abc123]',
    expected: 'Check <span class="custom-doc-placeholder" data-id="abc123"></span>',
  },
    {
    name: 'doc without parentheses uuid',
    input: 'Check [doc-abc123-aksldjalsd-asjdklajdlasd-12830123]',
    expected: 'Check <span class="custom-doc-placeholder" data-id="abc123-aksldjalsd-asjdklajdlasd-12830123"></span>',
  },
  {
    name: 'docsum with parentheses',
    input: 'See [docsum-(xyz789)]',
    expected: 'See <span class="custom-docsum-placeholder" data-id="xyz789"></span>',
  },
    {
    name: 'docsum with parentheses uuid',
    input: 'See [docsum-(xyz789-asdjalskd-aklsdjlasd)]',
    expected: 'See <span class="custom-docsum-placeholder" data-id="xyz789-asdjalskd-aklsdjlasd"></span>',
  },
  {
    name: 'docsum without parentheses',
    input: 'See [docsum-xyz789]',
    expected: 'See <span class="custom-docsum-placeholder" data-id="xyz789"></span>',
  },
    {
    name: 'docsum without parentheses uuid',
    input: 'See [docsum-xyz789-dalksjdlasd-129380123]',
    expected: 'See <span class="custom-docsum-placeholder" data-id="xyz789-dalksjdlasd-129380123"></span>',
  },
  {
    name: 'link with parentheses',
    input: 'Visit [link-(https://example.com)]',
    expected: 'Visit <span class="custom-link-placeholder" data-url="https://example.com"></span>',
  },
  {
    name: 'link without parentheses',
    input: 'Visit [link-https://example.com]',
    expected: 'Visit <span class="custom-link-placeholder" data-url="https://example.com"></span>',
  },
  {
    name: 'multiple patterns',
    input: 'Check [doc-doc1] and [docsum-(sum1)] and [link-http://test.com]',
    expected: 'Check <span class="custom-doc-placeholder" data-id="doc1"></span> and <span class="custom-docsum-placeholder" data-id="sum1"></span> and <span class="custom-link-placeholder" data-url="http://test.com"></span>',
  },
  {
    name: 'mixed with regular text',
    input: 'Here is a [doc-ref123] reference and some [docsum-(summary456)] text',
    expected: 'Here is a <span class="custom-doc-placeholder" data-id="ref123"></span> reference and some <span class="custom-docsum-placeholder" data-id="summary456"></span> text',
  },
  {
    name: 'multiple docs in one line',
    input: '[doc-id1] [doc-id2] [doc-id3]',
    expected: '<span class="custom-doc-placeholder" data-id="id1"></span> <span class="custom-doc-placeholder" data-id="id2"></span> <span class="custom-doc-placeholder" data-id="id3"></span>',
  },
  {
    name: 'multiple docsums in one line',
    input: '[docsum-(sum1)] [docsum-sum2] [docsum-(sum3)]',
    expected: '<span class="custom-docsum-placeholder" data-id="sum1"></span> <span class="custom-docsum-placeholder" data-id="sum2"></span> <span class="custom-docsum-placeholder" data-id="sum3"></span>',
  },
  {
    name: 'alternating doc and docsum',
    input: '[doc-d1] [docsum-s1] [doc-(d2)] [docsum-(s2)]',
    expected: '<span class="custom-doc-placeholder" data-id="d1"></span> <span class="custom-docsum-placeholder" data-id="s1"></span> <span class="custom-doc-placeholder" data-id="d2"></span> <span class="custom-docsum-placeholder" data-id="s2"></span>',
  },
  {
    name: 'multiple docs with UUIDs',
    input: '[doc-id1-abc-123] [doc-(id2-def-456)] and text [doc-id3-ghi-789]',
    expected: '<span class="custom-doc-placeholder" data-id="id1-abc-123"></span> <span class="custom-doc-placeholder" data-id="id2-def-456"></span> and text <span class="custom-doc-placeholder" data-id="id3-ghi-789"></span>',
  },
  {
    name: 'mixed doc docsum and link in one line',
    input: '[doc-ref1] [docsum-(sum1)] [link-https://example.com] [doc-(ref2)]',
    expected: '<span class="custom-doc-placeholder" data-id="ref1"></span> <span class="custom-docsum-placeholder" data-id="sum1"></span> <span class="custom-link-placeholder" data-url="https://example.com"></span> <span class="custom-doc-placeholder" data-id="ref2"></span>',
  },
  {
    name: 'doc and docsum with no space between',
    input: '[doc-ref1][docsum-sum1]',
    expected: '<span class="custom-doc-placeholder" data-id="ref1"></span><span class="custom-docsum-placeholder" data-id="sum1"></span>',
  },
  {
    name: 'multiple consecutive references no spaces',
    input: '[doc-d1][doc-d2][docsum-s1][docsum-s2]',
    expected: '<span class="custom-doc-placeholder" data-id="d1"></span><span class="custom-doc-placeholder" data-id="d2"></span><span class="custom-docsum-placeholder" data-id="s1"></span><span class="custom-docsum-placeholder" data-id="s2"></span>',
  },
  {
    name: 'consecutive with UUIDs no spaces',
    input: '[doc-(id1-abc-123)][docsum-(id2-def-456)][doc-id3-ghi-789]',
    expected: '<span class="custom-doc-placeholder" data-id="id1-abc-123"></span><span class="custom-docsum-placeholder" data-id="id2-def-456"></span><span class="custom-doc-placeholder" data-id="id3-ghi-789"></span>',
  },
  {
    name: 'all three types consecutive no spaces',
    input: '[doc-ref][docsum-(sum)][link-http://url.com]',
    expected: '<span class="custom-doc-placeholder" data-id="ref"></span><span class="custom-docsum-placeholder" data-id="sum"></span><span class="custom-link-placeholder" data-url="http://url.com"></span>',
  },
];

// Run tests
console.log('Running Custom Pattern Tests\n');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

testCases.forEach((testCase) => {
  const result = processCustomPatterns(testCase.input);
  const success = result === testCase.expected;

  if (success) {
    console.log(`✅ PASS: ${testCase.name}`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${testCase.name}`);
    console.log(`   Input:    ${testCase.input}`);
    console.log(`   Expected: ${testCase.expected}`);
    console.log(`   Got:      ${result}`);
    failed++;
  }
});

console.log('='.repeat(80));
console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
