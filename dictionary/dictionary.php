<!DOCTYPE html>
<html>
<head>
    <title>Dictionary</title>
    <meta charset="utf-8" />
    <link href="dictionary.css" type="text/css" rel="stylesheet" />
</head>
<body>
<div id="header">
    <h1>My Dictionary</h1>
<!-- Ex. 1: File of Dictionary -->
	<?php
    	$filename = "dictionary.tsv"; 
		$lines = file($filename);
	?>
	<p>
        My dictionary has <?= count($lines) ?> total words
        and
        size of <?= filesize($filename) ?> bytes.
    </p>
</div>
<div class="article">
    <div class="section">
        <h2>Today's words</h2>
<!-- Ex. 2: Today’s Words & Ex 6: Query Parameters -->
        <?php
            function getWordsByNumber($listOfWords, $numberOfWords){
                $resultArray = array();
//                implement here.
				shuffle($listOfWords);
				foreach ($listOfWords as $word) {
					$resultArray[] = $word;
					if (count($resultArray) == $numberOfWords) { break; }
				}
				return $resultArray;
            }
			if (isset($_GET["number_of_words"])) {
				$todaysWords = getWordsByNumber($lines, $_GET["number_of_words"]);
			}
			else {
				$todaysWords = getWordsByNumber($lines, 3);
			}
        ?>
        <ol>
        	<?php foreach ($todaysWords as $word) { $tmp = explode("\t", $word); ?>
        		<li><?= $tmp[0] ?> - <?= $tmp[1] ?></li>
        	<?php } ?>
        </ol>
    </div>
    <div class="section">
        <h2>Searching Words</h2>
<!-- Ex. 3: Searching Words & Ex 6: Query Parameters -->
        <?php
            function getWordsByCharacter($listOfWords, $startCharacter){
                $resultArray = array();
//                implement here.
				foreach($listOfWords as $word) {
					$tmp = explode("\t", $word);
					$index = strpos($tmp[0], $startCharacter);
					if (substr($tmp[0], 0, 1)  == $startCharacter) {
						$resultArray[] = $word; 
					}
				}
                return $resultArray;
            }
			if (isset($_GET["character"])) {
				$searchedWords = getWordsByCharacter($lines, $_GET["character"]);
			}
			else {
				$searchedWords = getWordsByCharacter($lines, "C");
			}
		?>
		<p>Words that started by <strong><?= $_GET["character"] ?></strong> are followings : </p>
		<ol>	
			<?php foreach ($searchedWords as $word) { $tmp = explode("\t", $word); ?>
        		<li><?= $tmp[0] ?> - <?= $tmp[1] ?></li>
        	<?php } ?>
    	</ol>
    </div>
    <div class="section">
        <h2>List of Words</h2>
<!-- Ex. 4: List of Words & Ex 6: Query Parameters -->
        <?php
            function getWordsByOrder($listOfWords, $orderby){
                $resultArray = $listOfWords;
//                implement here.
				if ($orderby == 0) {
					sort($resultArray);
				}
				else if ($orderby == 1) {
					rsort($resultArray);
				}
                return $resultArray;
            }
			if ($_GET["orderby"] == "") {
				$orderedList = getWordsByOrder($lines, 0);
			}
			else if (isset($_GET["orderby"])) {
				$orderedList = getWordsByOrder($lines, $_GET["orderby"]);
			}
			else {
				$orderedList = getWordsByOrder($lines, 0);
			}
			if ($orderby == 0) {
				print "All of words ordered by <strong>alphabetical order</strong> are followings :";
			}
			else if ($orderby == 1) {
				print "All of words ordered by <strong>alphabetical reverse order</strong> are followings :";
			}
			print "<ol>";
			foreach ($orderedList as $word) {
				$tmp = explode("\t", $word);
				if (strlen($tmp[0]) > 6) {
					print "<li class='long'>".$tmp[0]." - ".$tmp[1]."</li>";
				}
				else {
					print "<li>".$tmp[0]." - ".$tmp[1]."</li>";
				}
			}
			print "</ol>";
        ?>
    </div>
    <div class="section">
        <h2>Adding Words</h2>
<!-- Ex. 5: Adding Words & Ex 6: Query Parameters -->
        <?php
        	$newWord = $_GET["new_word"];
			$meaning = $_GET["meaning"];
			if ($newWord == null || $meaning == null) {
				print "Input word or meaning of the word doesn't exist.";
			}
			else {
				print "Adding a word is success!";
				file_put_contents($filename, "\n".$newWord."\t".$meaning, FILE_APPEND);
			}
        ?>
    </div>
</div>
<div id="footer">
    <a href="http://validator.w3.org/check/referer">
        <img src="http://selab.hanyang.ac.kr/courses/cse326/2015/problems/images/w3c-html.png" alt="Valid HTML5" />
    </a>
    <a href="http://jigsaw.w3.org/css-validator/check/referer">
        <img src="http://selab.hanyang.ac.kr/courses/cse326/2015/problems/images/w3c-css.png" alt="Valid CSS" />
    </a>
</div>
</body>
</html>