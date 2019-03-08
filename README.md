# bedrock-stats-push-http

## API Reference
## Modules

<dl>
<dt><a href="#module_bedrock-stats-push-http">bedrock-stats-push-http</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Target">Target</a> : <code>Object</code></dt>
<dd><p>The target options.</p>
</dd>
</dl>

<a name="module_bedrock-stats-push-http"></a>

## bedrock-stats-push-http
<a name="module_bedrock-stats-push-http.addTarget"></a>

### bedrock-stats-push-http.addTarget(options) ⇒ <code>Promise.&lt;undefined&gt;</code>
Add an HTTP target that will receive stats reports.

**Kind**: static method of [<code>bedrock-stats-push-http</code>](#module_bedrock-stats-push-http)  
**Returns**: <code>Promise.&lt;undefined&gt;</code> - Resolves on completion.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | The options to use. |
| options.target | [<code>Target</code>](#Target) |  | The target options. |
| options.source | <code>Object</code> |  | The source options. May contain arbitrary   properties in addition to `id`. |
| options.source.id | <code>string</code> |  | Identifies the source to the target. |
| [options.startDate] | <code>number</code> | <code>Date.now()</code> | The start date for the first   report sent to the target in ms since epoch. |

<a name="Target"></a>

## Target : <code>Object</code>
The target options.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| endpoint | <code>string</code> |  | The HTTP REST endpoint. |
| monitorIds | <code>Array.&lt;string&gt;</code> |  | The stat monitors to report on. |
| storageApi | <code>string</code> |  | The storage API to query. |
| [strictSSL] | <code>boolean</code> | <code>true</code> | Use strictSSL when communicating   with this target. |

